import MetroSchedule from '../models/metroScheduleModel.js';
import MetroStation from '../models/metroStationModel.js'; // new: create model if not present

const normalize = s => String(s || '').trim().toLowerCase();

async function getStationOrderFromDb() {
  // try different common sort keys used for ordering in a stations collection
  const sorts = [{ sequence: 1 }, { order: 1 }, { index: 1 }, { _id: 1 }];
  for (const sort of sorts) {
    try {
      const docs = await MetroStation.find({}, { name: 1 }).sort(sort).lean();
      if (Array.isArray(docs) && docs.length > 0 && docs.every(d => d.name)) {
        return docs.map(d => String(d.name).trim());
      }
    } catch (err) {
      // ignore and try next sort
    }
  }
  return null;
}

// fallback roadmap (only used if DB has no station documents)
const FALLBACK_STATION_ORDER = [
  "Uttara North Metro Station",
  "Uttara Center Metro Station",
  "Uttara South Metro Station",
  "Pallabi Metro Station",
  "Mirpur 11 Metro Station",
  "Mirpur 10 Metro Station",
  "Kazipara Metro Station",
  "Shewrapara Metro Station",
  "Agargaon Metro Station",
  "Bijoy Sarani Metro Station",
  "Farmgate Metro Station",
  "Karwan Bazar Metro Station",
  "Shahbag Metro Station",
  "Dhaka University Metro Station",
  "Bangladesh Secretariat Metro Station",
  "Motijheel Metro Station"
];

const matchStation = (field = '', query = '') => {
  const f = normalize(field);
  const q = normalize(query);
  if (!f || !q) return false;
  return f === q || f.includes(q) || q.includes(f);
};

const parseTimeToMinutes = (t = '00:00') => {
  const [h = '0', m = '0'] = String(t).split(':');
  return Number(h) * 60 + Number(m);
};

const getSchedules = async (req, res) => {
    const { sourceStation, destinationStation, time, station } = req.query;
    try {
        const dbOrder = await getStationOrderFromDb();
        const STATION_ORDER = Array.isArray(dbOrder) && dbOrder.length >= 2 ? dbOrder : FALLBACK_STATION_ORDER;

        const query = {};

        if (station) {
            query.$or = [
                { sourceStation: { $regex: station, $options: 'i' } },
                { destinationStation: { $regex: station, $options: 'i' } }
            ];
        }

        if (time) {
            query.departureTime = { $regex: `^${time}` };
        }

        if (Object.keys(query).length > 0) {
            const schedules = await MetroSchedule.find(query).lean();
            return res.json(schedules);
        }

    if (!sourceStation || !destinationStation) {
      const all = await MetroSchedule.find().lean();
      return res.json(all);
    }

    const srcNorm = normalize(sourceStation);
    const dstNorm = normalize(destinationStation);

    const srcIdx = STATION_ORDER.findIndex(s => normalize(s) === srcNorm);
    const dstIdx = STATION_ORDER.findIndex(s => normalize(s) === dstNorm);

    if (srcIdx === -1 || dstIdx === -1 || srcIdx === dstIdx) {
      return res.json([]); // no valid order found
    }

    // find candidate train names that reference either station (substring, case-insensitive)
    let candidateTrains = await MetroSchedule.distinct('trainName', {
      $or: [
        { sourceStation: { $regex: srcNorm, $options: 'i' } },
        { destinationStation: { $regex: dstNorm, $options: 'i' } },
        { sourceStation: { $regex: dstNorm, $options: 'i' } },
        { destinationStation: { $regex: srcNorm, $options: 'i' } },
      ],
    });

    console.log('initial candidateTrains count:', candidateTrains.length);

    // fallback: if none found, broaden to all train names
    if (!candidateTrains || candidateTrains.length === 0) {
      candidateTrains = await MetroSchedule.distinct('trainName');
      console.log('fallback to all trains, count:', candidateTrains.length);
    }

    const results = [];

    for (const trainName of candidateTrains) {
      const segments = await MetroSchedule.find({ trainName }).sort({ departureTime: 1, _id: 1 }).lean();

      // DEBUG: log first few segments to inspect actual fields
      console.log('---- trainName:', trainName, 'segments count:', (segments || []).length);
      segments.slice(0, 8).forEach((seg, idx) => {
        console.log(idx, 'src:', JSON.stringify(seg.sourceStation), 'dst:', JSON.stringify(seg.destinationStation), 'dep:', seg.departureTime, 'arr:', seg.arrivalTime, 'fare:', seg.fare);
      });

      if (!segments || segments.length === 0) continue;

      // find source index (segment where train departs from sourceStation)
      const srcIndex = segments.findIndex(s => matchStation(s.sourceStation, srcNorm));
      console.log('  srcIndex for', trainName, '=', srcIndex);
      if (srcIndex === -1) continue;

      // find destination index (segment after srcIndex where train arrives at destinationStation)
      const dstIndex = segments.findIndex((s, i) => i >= srcIndex && matchStation(s.destinationStation, dstNorm));
      console.log('  dstIndex for', trainName, '=', dstIndex);
      if (dstIndex === -1) continue;

      // compute fare: sum segment.fare if present, otherwise approximate from time difference
      const fareFromSegments = segments.slice(srcIndex, dstIndex + 1).reduce((sum, seg) => sum + (Number(seg.fare) || 0), 0);
      let fare = fareFromSegments;
      if (!fare || fare === 0) {
        const dep = parseTimeToMinutes(segments[srcIndex].departureTime);
        const arr = parseTimeToMinutes(segments[dstIndex].arrivalTime);
        let diff = Math.abs(arr - dep);
        if (!diff) diff = 6;
        fare = Math.max(10, Math.round(diff * 5)); // fallback formula
      }

      results.push({
        from: segments[srcIndex].sourceStation,
        to: segments[dstIndex].destinationStation,
        trainName,
        departureTime: segments[srcIndex].departureTime,
        arrivalTime: segments[dstIndex].arrivalTime,
        price: fare, // Renamed fare to price
        frequency: segments[srcIndex].frequency, // Assuming frequency is on the segment
        segmentIds: segments.slice(srcIndex, dstIndex + 1).map(s => s._id),
      });
    }

    console.log('getSchedules results count:', results.length);
    return res.json(results);
  } catch (err) {
    console.error('getSchedules error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new schedule
// @route   POST /api/schedules
// @access  Private/Admin
const createSchedule = async (req, res) => {
  const { sourceStation, destinationStation, trainName, departureTime, arrivalTime, frequency } = req.body;

  try {
    const schedule = new MetroSchedule({
      sourceStation,
      destinationStation,
      trainName,
      departureTime,
      arrivalTime,
      frequency,
    });

    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin
const updateSchedule = async (req, res) => {
  const { sourceStation, destinationStation, trainName, departureTime, arrivalTime, frequency } = req.body;

  try {
    const schedule = await MetroSchedule.findById(req.params.id);

    if (schedule) {
      schedule.sourceStation = sourceStation || schedule.sourceStation;
      schedule.destinationStation = destinationStation || schedule.destinationStation;
      schedule.trainName = trainName || schedule.trainName;
      schedule.departureTime = departureTime || schedule.departureTime;
      schedule.arrivalTime = arrivalTime || schedule.arrivalTime;
      schedule.frequency = frequency || schedule.frequency;

      const updatedSchedule = await schedule.save();
      res.json(updatedSchedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await MetroSchedule.findById(req.params.id);

    if (schedule) {
      await MetroSchedule.deleteOne({ _id: req.params.id });
      res.json({ message: 'Schedule removed' });
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getSchedules, createSchedule, updateSchedule, deleteSchedule };