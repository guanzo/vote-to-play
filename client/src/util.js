export function delayPromise(duration = 1000){
    return new Promise(res=>setTimeout(res,duration))
}

export function capitalize(str){
    return string.charAt(0).toUpperCase() + string.slice(1);
}