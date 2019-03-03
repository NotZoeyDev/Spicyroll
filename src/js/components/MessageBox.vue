<template>
    <div class="message-box-background" ref="background" v-if="show">
        <div class="message-box">
            <p ref="text">
                {{ text }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            text: "",
            duration: 0
        }
    },

    mounted() {
        this.$parent.$on("MessageBox", (options) => {
            this.text = options.text;
            this.duration = options.duration;

            this.show = true;

            setTimeout(() => {
                this.$refs.background.classList.add("hide");

                setTimeout(() => {
                    this.show = false;
                }, 200);
            }, 1000*this.duration);
        });
    }
}
</script>

<style module>
    .message-box-background.hide {
        animation: background-hide .2s ease 1 normal forwards;
    }

    .message-box-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(30, 30, 30, 0);
        animation: background-show .2s ease 1 normal forwards;
        z-index: 6;
    }

    @keyframes background-show {
        from {
            background-color: rgba(30, 30, 30, 0);
        } to {
            background-color: rgba(30, 30, 30, 0.75);
        }
    }

    @keyframes background-hide {
        from {
            background-color: rgba(30, 30, 30, 0.75);
        } to {
            background-color: rgba(30, 30, 30, 0);
        }
    }

    .message-box-background.hide .message-box {
        animation: box-hide .2s ease 1 normal forwards;
    }

    .message-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        max-width: 400px;
        z-index: 7;
        background-color: rgb(50, 50, 50);
        animation: box-show .2s ease 1 normal forwards;
        border-radius: 5px;
    }

    @keyframes box-show {
        from {
            transform: translate(-50%, -50%) scale(0);
        } to {
            transform: translate(-50%, -50%) scale(1);
        }
    }

    @keyframes box-hide {
        from {
            transform: translate(-50%, -50%) scale(1);
        } to {
            transform: translate(-50%, -50%) scale(0);
        }
    }

    .message-box p {
        padding: 25px;
        text-align: center;
        font-size: 1.5em;
        color: white;
    }
</style>
