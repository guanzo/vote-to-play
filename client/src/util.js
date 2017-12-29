export function delayPromise(duration = 1000){
    return new Promise(res=>setTimeout(res,duration))
}


export function getActiveFilters(filters){
	return filters.filter(({type,vmodel,options})=>{
		if(type === 'text')
			return vmodel.length > 0
		else if(type === 'select')
			return vmodel !== options[0]
	})
}
