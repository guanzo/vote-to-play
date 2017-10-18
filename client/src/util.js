
let imgContext = require.context('@/assets/images/',true,/\.(png|jpe?g|gif|svg)(\?.*)?$/)

export default {
    getImage(path, fallback = ''){
        let img;
        try {
            img = imgContext(path)
        }catch(e) {
            console.log(e)
            img = fallback
        }
        return img;
    }
}