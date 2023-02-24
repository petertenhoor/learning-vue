import {createApp} from "vue/dist/vue.esm-bundler"

import "./style.css"

/**
 * Get random number between given min and max number
 * @param min
 * @param max
 * @returns {*}
 */
const getRandomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min

createApp({
    data() {
        return {
            count: 0
        }
    },
    methods: {
        setRandomValue(event) {
            if (event) event.preventDefault()
            this.count = getRandomNumberBetween(0, 100)
        }
    }
}).mount('#app')