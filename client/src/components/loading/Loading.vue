<template>
    <div class="cell">
        <div class="loader square switch">
            <div class="block">
                <div class="box"></div>
            </div>
        </div>
  </div>
</template>

<script>
//generic loader
export default {
    name:'loading'
}

</script>

<style lang="scss" scoped>

$s: 20px; //size
$m: 2px; //margin
$d: 1s; //speed
//colors
$fg: #eee;


.cell{
	position: relative;
	width: $s*5;
	height: $s*5;
	flex-shrink: 1;
	flex-grow: 1;
    
    .loader{
        position: absolute;
        top: 50%;
        left: 50%;
        &.square{
            .block{
                border-radius: $m*2;
                width: 2*$s + $m*5;
                height: 2*$s + $m*5;
                &:before, &:after{
                    bottom: $m;
                }
                &:before{
                    left: $m;
                }
                &:after{
                    right: $m;
                }
                .box{
                    left: $m;
                    top: $m;
                    animation-name: slide;
                }
            }
        }
        &.switch{
            .block{
                animation-name: switch;
                animation-duration: $d*2;
                animation-timing-function: steps(4);
                .box{
                    animation-duration: $d*.5;
                }
            }
        }
    }
    .block{
        position: absolute;
        color: $fg;
        border: $m solid transparent;
        transform: translate(-50%, -50%) rotate(-45deg);
        animation-timing-function: ease-in-out;
        animation-duration: $d;
        animation-iteration-count: infinite;
        &:before, &:after{
            content: "";
            position: absolute;
            width: $s;
            height: $s;
            background: $fg;
            border-radius: $m*2;
        }
        &:before{
            left: $m;
        }
        &:after{
            right: $m;
        }
    }
    .box{
        position: absolute;
        width: $s;
        height: $s;
        background: $fg;
        border-radius: $m*2;
        animation-timing-function: ease-in-out;
        animation-duration: $d;
        animation-iteration-count: infinite;
    }
}


@keyframes slide{
	33%{
		left: $m;
	}
	67%,100%{
		left: $m*2 + $s;
	}
}
@keyframes switch{
	to{
		transform: translate(-50%, -50%) rotate(-405deg);
	}
}

</style>