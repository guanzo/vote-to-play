import ImageGrid from '@/components/viewer/voter/ImageGrid'

describe('ImageGrid.vue', () => {
    let candidates = [{ name: 'yo' },{ name: 'hi'}];
    let filteredCandidates = [candidates[0]]
    it('filtered grid should have correct class names', () => {
        
        const Constructor = Vue.extend(ImageGrid)
        const vm = new Constructor({
            store: new Vuex.Store({}),
            propsData: {
                candidates,
                filteredCandidates
            }
        }).$mount()
        let children = vm.$el.children
        expect(children[0].firstChild.className).to.include('filtered-in')
        expect(children[1].firstChild.className).to.include('filtered-out')
    })
})

