// Adaptive Video Quality Loader
class AdaptiveVideoLoader {
    constructor() {
        this.connectionSpeed = this.detectConnectionSpeed();
        this.deviceCapability = this.detectDeviceCapability();
    }

    detectConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === '4g') return 'high';
            if (connection.effectiveType === '3g') return 'medium';
            return 'low';
        }
        return 'medium'; // default
    }

    detectDeviceCapability() {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasHighDPI = window.devicePixelRatio > 1;
        
        if (isMobile && !hasHighDPI) return 'low';
        if (isMobile && hasHighDPI) return 'medium';
        return 'high';
    }

    selectVideoQuality() {
        if (this.connectionSpeed === 'low' || this.deviceCapability === 'low') {
            return 'low';
        }
        if (this.connectionSpeed === 'medium' || this.deviceCapability === 'medium') {
            return 'medium';
        }
        return 'high';
    }

    getOptimizedVideoSrc(baseSrc) {
        const quality = this.selectVideoQuality();
        const ext = baseSrc.split('.').pop();
        const baseName = baseSrc.replace(`.${ext}`, '');
        
        // Try WebM first for supported browsers
        if (this.supportsWebM()) {
            return `${baseName}_${quality}.webm`;
        }
        
        return `${baseName}_${quality}.mp4`;
    }

    supportsWebM() {
        const video = document.createElement('video');
        return video.canPlayType('video/webm; codecs="vp9"') !== '';
    }

    // Apply to all videos on page
    optimizeAllVideos() {
        document.querySelectorAll('video[data-adaptive]').forEach(video => {
            const originalSrc = video.getAttribute('data-adaptive');
            video.src = this.getOptimizedVideoSrc(originalSrc);
        });
    }
}

// Usage: Replace video src with data-adaptive attribute
// <video data-adaptive="assets/demo.mp4" ...>
// Then call: new AdaptiveVideoLoader().optimizeAllVideos(); 