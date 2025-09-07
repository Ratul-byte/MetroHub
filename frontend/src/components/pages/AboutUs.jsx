import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Button from "../ui/Button";
import { Card } from "../ui/Card";
import { CardContent } from "../ui/CardContent";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import ratul_img from "../../assets/ratul.jpg";
import sadman_img from "../../assets/sadman.jpg";
import abid_img from "../../assets/abid.png";
import AnimatedSection from "../ui/AnimatedSection";



export function AboutUs({ onNavigate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (value / 100) * duration;
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const current = video.currentTime;
      const duration = video.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <AnimatedSection>
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1692162708126-c0316a14260b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxkaGFrYSUyMG1ldHJvJTIwcmFpbCUyMHN0YXRpb258ZW58MXx8fHwxNzU2OTc4MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Dhaka Metro Rail Station"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <motion.h1 
              className="text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              About MetroHub
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Revolutionizing urban transportation in Dhaka through innovative technology and seamless user experiences. 
              We're connecting the heart of Bangladesh, one journey at a time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Discover Our Story
              </Button>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Interactive Video Section */}
      <AnimatedSection delay={0.2}>
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Experience MetroHub</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how we're transforming the way people navigate Dhaka's metro rail system.
            </p>
          </div>

          <Card className="overflow-hidden bg-black">
            <CardContent className="p-0 relative">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                poster="https://images.unsplash.com/photo-1675874388836-8912e59d5d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwdHJhbnNwb3J0JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NTY5MjU5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              >
                <source src="/api/placeholder/video" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Custom Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4 text-white">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={restart}
                    className="hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ffffff ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                      }}
                    />
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="hover:bg-white/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </AnimatedSection>

      {/* Our Mission */}
      <AnimatedSection delay={0.3}>
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl leading-relaxed mb-12">
              At MetroHub, we believe that urban mobility in Dhaka should be effortless, efficient, and accessible to everyone. 
              Our mission is to bridge the gap between Dhaka's growing metro rail system and the millions who depend on it daily.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🚇</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Seamless Travel</h3>
                <p className="text-muted-foreground">
                  Making metro travel as simple as a few taps on your phone.
                </p>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-muted-foreground">
                  Always stay informed with live schedules and service updates.
                </p>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sustainable Dhaka</h3>
                <p className="text-muted-foreground">
                  Promoting eco-friendly transportation for a greener Dhaka.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Our Story */}
      <AnimatedSection delay={0.4}>
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Founded in 2025 by a team of Bangladeshi urban planning enthusiasts and tech innovators, 
                  MetroHub was born from the vision of making Dhaka's new metro rail system accessible and user-friendly for everyone.
                </p>
                <p className="text-lg leading-relaxed mb-8">
                  As Dhaka Metro Rail began operations, we realized the need for a comprehensive digital platform 
                  that would help residents navigate this revolutionary transportation system. That's when we decided to create 
                  MetroHub - making metro travel in Dhaka as intuitive as ordering a ride.
                </p>
                <Button size="lg" className="hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2 border-black border-2">Join Our Journey</Button>
              </div>
              
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1531535807748-218331acbcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU2OTAwNjc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Team collaboration"
                  className="rounded-lg shadow-2xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Impact Stats */}
      <AnimatedSection delay={0.5}>
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">Our Impact</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[{ number: "12", label: "Metro Stations Covered" },
                { number: "99.9%", label: "Uptime" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-primary-foreground/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Our Team */}
      <AnimatedSection delay={0.5}>
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind MetroHub, working to revolutionize transportation in Dhaka.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative mb-6">
                  <ImageWithFallback
                    src={ratul_img}
                    alt="Md. Ratul Mushfique"
                    className="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Md. Ratul Mushfique</h3>
                <a 
                  href="https://github.com/ratul-mushfique" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative mb-6">
                  <ImageWithFallback
                    src={sadman_img}
                    alt="Sadman Safiur Rahman"
                    className="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Sadman Safiur Rahman</h3>
                <a 
                  href="https://github.com/sadman-safiur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative mb-6">
                  <ImageWithFallback
                    src={abid_img}
                    alt="Kazi Amzad Abid"
                    className="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Kazi Amzad Abid</h3>
                <a 
                  href="https://github.com/kazi-amzad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection delay={0.6}>
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Commute?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of Dhaka residents who have already made the switch to smarter metro travel.
            </p>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}