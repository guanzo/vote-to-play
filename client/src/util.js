export function delayPromise(duration = 1000){
    return new Promise(res=>setTimeout(res,duration))
}


