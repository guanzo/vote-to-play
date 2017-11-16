<template>
    <div class='loading'>
        <div class='loading__square' v-for="n in 7" :key="n"></div>
    </div>
</template>

<script>

export default {
    name:'loading'
}

</script>

<style lang="scss" scoped>

// Inspired by this reddit post: https://www.reddit.com/r/oddlysatisfying/comments/6b1mro/a_loading_gif_animation_i_made/
// Feel free to use it in your projects in whatever way you want.

// Some variables for you to play around with.
$square: 20px;
$duration: 10s;

// In case you're wondering why I didn't use transforms here: it's because 'background-attachment: fixed' doesn't work with transformed elements. I needed the background-attachment so I can get the subtle gradient across all pieces. Works only in Webkit (and maybe IE, I don't know).
@keyframes square-animation {
  0% {left: 0; top: 0}

  10.5% {left: 0; top: 0;}
  12.5% {left: $square; top: 0;}

  23% {left: $square; top: 0;}
  25% {left: $square * 2; top: 0;}

  35.5% {left: $square * 2; top: 0;}
  37.5% {left: $square * 2; top: $square;}

  48% {left: $square * 2; top: $square;}
  50% {left: $square; top: $square;}

  60.5% {left: $square; top: $square;}
  62.5% {left: $square; top: $square * 2;}

  73% {left: $square; top: $square * 2;}
  75% {left: 0; top: $square * 2;}

  85.5% {left: 0; top: $square * 2;}
  87.5% {left: 0; top: $square;}

  98% {left: 0; top: $square;}
  100% {left: 0; top: 0;}
}

// This is just a cute animation that cycles through the different hues.
@keyframes hue-rotate {
  0% {filter: hue-rotate(0deg)}
  100% {filter: hue-rotate(360deg)}
}


// Set the rotation to '-135deg' to get a heart shaped loading indicator. 😘
.loading {
  position: relative;
  margin: 15px;
  width: $square * 3;
  height: $square * 3;
  transform: rotate(45deg);
  animation: hue-rotate $duration linear infinite both;
}

// Like I said, I'm using 'position: absolute' because of the background-attachment that otherwise doesn't work.
// The 'background-attachment: fixed' lets it look like the gradient is flowing across all pieces instead of each piece individually.
// At the end of the style you can see a little loop that sets different negative animation delays so the pieces start animating at different positions.
.loading__square {
  position: absolute;
  top: 0;
  left: 0;
  width: $square - 4px;
  height: $square - 4px;
  margin: 2px;
  border-radius: 2px;
  background: #07a;
  background-image: linear-gradient(45deg, #fa0 40%, #0c9 60%);
  background-image: -moz-linear-gradient(#fa0, #fa0);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  animation: square-animation $duration ease-in-out infinite both;
  
  @for $i from 0 through 7 {
    &:nth-of-type(#{$i}) {
      animation-delay: -($duration / 7) * $i
    }
  }
}

</style>