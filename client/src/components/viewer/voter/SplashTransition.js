
/**
 * Intended behavior:
 * -only works for supported games
 * -user submits vote
 * -vote ui disappears, splash art appears
 * -after duration, splash art && voter div fades out
 * -vote ui reappears after the fade out (voter div still hidden)
 */
export default function splashTransitionDefaults(){
    let duration = 4000
    return {
        isActive: false,
        hideVoteUI: false,
        splashImgIsLoaded: false,
        splashClass: Math.random() < 0.5 ? 'animate-to-left' : 'animate-to-right',
        splashStyle: { 'animation-duration': duration + 'ms' },
        duration,
    }
}