import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Button from "../ui/Button";

const AnimatedCredit = ({ 
  children, 
  delay = 0 
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ 
        duration: 1.5, 
        delay,
        ease: "easeOut"
      }}
      variants={{
        visible: { 
          opacity: 1, 
          y: 0,
          filter: "blur(0px)"
        },
        hidden: { 
          opacity: 0, 
          y: 100,
          filter: "blur(10px)"
        }
      }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        {children}
      </div>
    </motion.div>
  );
};

export function Extras() {
  useEffect(() => {
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicNotice, setShowMusicNotice] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Try to play audio when component mounts
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Audio autoplay prevented:", error);
          setIsPlaying(false);
        }
      };

      playAudio();

      // Add event listeners
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }

    // Hide music notice after 5 seconds
    const timer = setTimeout(() => {
      setShowMusicNotice(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }
  };

const credits = [
  {
    text: "A Ratul Mushfique Project",
    size: "text-4xl md:text-6xl lg:text-7xl",
    delay: 1.5
  },
  {
    title: "Project Lead",
    name: "Ratul Mushfique",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  {
    title: "System Architect",
    name: "Ratul Mushfique",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  {
    title: "Project Demonstrator",
    name: "Sadman Safiur Rahman",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  {
    title: "System Documenter",
    name: "Kazi Amzad Abid",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  // Development
  {
    title: "Frontend Engineer",
    name: "Ratul Mushfique",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  {
    title: "Backend Engineer",
    name: "Ratul Mushfique",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  {
    title: "Database Architect and Data Engineer",
    name: "Ratul Mushfique",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  {
    title: "API & Integration Engineer",
    name: "Ratul Mushfique",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  },
  // Design
  {
    title: "UI/UX Designer",
    name: "Ratul Mushfique",
    sizeTitle: "text-2xl md:text-4xl lg:text-5xl",
    sizeName: "text-xl md:text-3xl lg:text-4xl",
    delay: 1.5
  }
];

  return (
    <div className="bg-black text-white overflow-hidden relative">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        volume={0.3}
        preload="auto"
      >
        <source src="/Elegia (2015 Remaster).mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Notice */}

      {/* Audio Controls with Now Playing */}
      <motion.div 
        className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-lg rounded-lg p-3 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-xs text-white/60 hidden md:block">
          <div className="text-white/80">Elegia (2015 Remaster)</div>
          <div className="text-white/40">New Order</div>
          
        </div>
        
        {/* Audio visualizer */}
        {isPlaying && (
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: ["4px", "16px", "8px", "20px", "4px"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            onClick={togglePlayPause}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-8 w-8 p-0"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </Button>
          <Button
            onClick={toggleMute}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-8 w-8 p-0"
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
        </div>
      </motion.div>
      {/* Hero Section with Initial Animation */}
      <motion.section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0">
          {/* Animated background particles */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: isPlaying ? [0.1, 0.6, 0.1] : [0.2, 0.4, 0.2],
                scale: isPlaying ? [1, 2, 1] : [1, 1.5, 1],
              }}
              transition={{
                duration: isPlaying ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          
          {/* Ambient background glow that pulses with music */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
        
        <motion.div 
          className="text-center z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-thin tracking-widest mb-8"
            initial={{ letterSpacing: "0em" }}
            animate={{ letterSpacing: "0.3em" }}
            transition={{ duration: 2, delay: 1 }}
          >
            CREDITS
          </motion.h1>
          
          <motion.div
            className="w-32 h-px bg-white mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 1.5, delay: 2 }}
          />
        </motion.div>
      </motion.section>

      {/* Credits Sections */}
      {credits.map((credit, index) => (
        <AnimatedCredit key={index} delay={credit.delay}>
          {credit.text ? (
            <motion.h2 
              className={`${credit.size} font-thin tracking-wide cursor-default`}
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 30px rgba(255,255,255,0.6)",
                letterSpacing: "0.05em"
              }}
              transition={{ 
                type: "tween", 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              {credit.text}
            </motion.h2>
          ) : (
            <div className="text-center">
              <motion.h2
                className={`${credit.sizeTitle} font-thin tracking-wide cursor-default`}
                whileHover={{ 
                  scale: 1.02,
                  textShadow: "0 0 30px rgba(255,255,255,0.6)",
                  letterSpacing: "0.05em"
                }}
                transition={{ 
                  type: "tween", 
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {credit.title}
              </motion.h2>
              <motion.p
                className={`${credit.sizeName} text-white/80 font-thin tracking-wide cursor-default mt-4`}
                whileHover={{ 
                  scale: 1.02,
                  textShadow: "0 0 30px rgba(255,255,255,0.6)",
                  letterSpacing: "0.05em"
                }}
                transition={{ 
                  type: "tween", 
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {credit.name}
              </motion.p>
            </div>
          )}
          
          {/* Decorative line under each credit */}
          <motion.div
            className="w-24 h-px bg-white/60 mx-auto mt-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "6rem", opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          />
        </AnimatedCredit>
      ))}

      {/* Final Section with Thank You Message */}
      <AnimatedCredit delay={1.5}>
        <div className="space-y-8">
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-thin tracking-wide cursor-default"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 40px rgba(255,255,255,0.7)",
              letterSpacing: "0.1em"
            }}
            transition={{ 
              duration: 2,
              hover: {
                type: "tween",
                duration: 0.4,
                ease: "easeOut"
              }
            }}
            viewport={{ once: true }}
          >
            MetroHub
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            A comprehensive metro transportation platform designed to revolutionize urban mobility. 
            Bringing together real-time schedules, seamless booking, and intelligent route planning 
            in one unified experience.
          </motion.p>
          
          <motion.div
            className="flex justify-center space-x-4 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            viewport={{ once: true }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </AnimatedCredit>

      {/* End Section with Fade to Black */}
      <section className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 3 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-2xl md:text-3xl font-thin tracking-widest cursor-default"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            whileHover={{
              scale: 1.02,
              textShadow: "0 0 25px rgba(255,255,255,0.8)",
              letterSpacing: "0.2em"
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              hover: {
                type: "tween",
                duration: 0.3,
                ease: "easeOut"
              }
            }}
          >
            Thank you for using MetroHub
          </motion.h3>
        </motion.div>
      </section>
    </div>
  );
}
