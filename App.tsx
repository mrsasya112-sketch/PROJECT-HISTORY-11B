import { useState, useEffect, useRef } from 'react';

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(8924);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // MutationObserver для очистки DOM (демонстрация концепта)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Здесь можно удалять нежелательные элементы
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Удаление скриптов, которые не нужны
            const scripts = node.querySelectorAll('script[src*="ads"], script[src*="analytics"]');
            scripts.forEach(script => script.remove());
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

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

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TikTok Video',
        text: 'Check out this video!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="app-container">
      {/* Video Container - Fullscreen */}
      <div className="video-container">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            loop
            playsInline
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='700'%3E%3Crect width='400' height='700' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='20' font-family='Arial'%3ETikTok Video Player%3C/text%3E%3C/svg%3E"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>
          
          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <div className="liquid-glass-light w-20 h-20 rounded-full flex items-center justify-center animate-in">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Info Bar - Liquid Glass */}
      <div className="info-bar liquid-glass animate-in">
        <div className="info-content">
          <div className="avatar">
            <span>JD</span>
          </div>
          <div className="user-info">
            <h3>@johndoe_creator</h3>
            <p>Original Audio</p>
          </div>
        </div>
      </div>

      {/* Bottom Description - Liquid Glass */}
      <div className="description-bar liquid-glass animate-in">
        <p className="description-text">
          🎨 Liquid Glass UI Design • Clean minimal interface with backdrop blur effects • 
          Full-screen video experience without distractions #design #ui #minimal
        </p>
      </div>

      {/* Controls - Right Side - Liquid Glass */}
      <div className="controls-container animate-in">
        {/* Like Button */}
        <div className="control-btn liquid-glass-light" onClick={handleLike}>
          <svg 
            className="w-7 h-7" 
            fill={isLiked ? "#FF0050" : "white"} 
            viewBox="0 0 24 24"
            style={{ transition: 'all 0.3s ease' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="control-count">{likes.toLocaleString()}</span>
        </div>

        {/* Comment Button */}
        <div className="control-btn liquid-glass-light">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <span className="control-count">1.2K</span>
        </div>

        {/* Share Button */}
        <div className="control-btn liquid-glass-light" onClick={handleShare}>
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          <span className="control-count">Share</span>
        </div>

        {/* More Options */}
        <div className="control-btn liquid-glass-light">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
