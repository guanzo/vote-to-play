import CandidateGrid from '@/components/grid/CandidateGrid'
import { 
	FILTER_MODE_HIGHLIGHT, FILTER_MODE_REMOVE 
} from '@/store/modules/games/util/gameMixin'

const candidates = [{ name: 'yo' },{ name: 'hi'},{ name: 'yoyo' },{ name: 'hihi'}];
const filteredCandidates = candidates.slice(0,3)


function mockComponent(gameOptions, pageSize){
	const Constructor = Vue.extend(CandidateGrid)
	const vm = new Constructor({
		store: new Vuex.Store({}),
		propsData: {
			candidates,
			filteredCandidates,
			gameOptions
		}
	})
	vm.pageSize = pageSize;
	vm.$mount()
	return vm
}

describe('CandidateGrid.vue', () => {
	
    it(`filtermode: ${FILTER_MODE_HIGHLIGHT}, filtered grid should have correct class names`,()=>{
        const gameOptions = {
			filterMode: FILTER_MODE_HIGHLIGHT
		}
        const vm = mockComponent(gameOptions)
		const children = vm.$el.querySelectorAll('.candidate')
		expect(children.length).to.equal(candidates.length)
        expect(children[0].className).to.include('filtered-in')
        expect(children[1].className).to.include('filtered-in')
        expect(children[2].className).to.include('filtered-in')
        expect(children[3].className).to.include('filtered-out')
	})
	
    it(`filtermode: ${FILTER_MODE_REMOVE}, filtered grid should only contain matched candidates`,()=>{
        const gameOptions = {
			filterMode: FILTER_MODE_REMOVE
		}
        const vm = mockComponent(gameOptions)
        const children = vm.$el.querySelectorAll('.candidate')
		expect(children.length).to.equal(filteredCandidates.length)
	})

	it('hasPaginatedGrid: true, shows current page && page button if has more data',()=>{
		const gameOptions = {
			filterMode: FILTER_MODE_REMOVE,
			hasPaginatedGrid: true
		}
		const pageSize = 2
		const vm = mockComponent(gameOptions, pageSize)
		const children = vm.$el.querySelectorAll('.candidate')
		expect(children.length).to.equal(pageSize)
		const pageButton = vm.$el.querySelector('.show-more')
		expect(pageButton).to.not.be.null
	})
	
	it('hasPaginatedGrid: true, does not show page button if no more data',()=>{
		const gameOptions = {
			filterMode: FILTER_MODE_REMOVE,
			hasPaginatedGrid: true
		}
		const pageSize = filteredCandidates.length
		const vm = mockComponent(gameOptions,pageSize)
		const children = vm.$el.querySelectorAll('.candidate')
		expect(children.length).to.equal(pageSize)
		const pageButton = vm.$el.querySelector('.show-more')
		expect(pageButton).to.be.null
	})

	it('hasPaginatedGrid: true, shows next page on paginate',done=>{
		const gameOptions = {
			filterMode: FILTER_MODE_REMOVE,
			hasPaginatedGrid: true
		}
		const pageSize = 2
		const vm = mockComponent(gameOptions, pageSize)
		vm.onPaginate()
		//wait for transition
		setTimeout(()=>{
			const children = vm.$el.querySelectorAll('.candidate')
			expect(children.length).to.equal(filteredCandidates.length)
			const pageButton = vm.$el.querySelector('.show-more')
			expect(pageButton).to.be.null
			done()
		},100)
	})
})

