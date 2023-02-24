import {createApp} from "vue/dist/vue.esm-bundler"
import {v4 as uuid} from "uuid"

import "./style.css"

//create Vue app
const app = createApp({

    /**
     * App data
     * @returns {object}
     */
    data() {

        //get filter state from LS
        let filterState = 'all'
        const filterStateLs = localStorage.getItem('filterState')
        if (filterState && ['all', 'incomplete', 'complete'].includes(filterStateLs)) filterState = filterStateLs

        //get items from LS
        let items = []
        const itemsLs = localStorage.getItem('items')
        if (itemsLs) items = JSON.parse(itemsLs)

        //get initial filter counts
        const countAll = items.length
        const countCompleted = [...items].filter(item => item.finished).length
        const countIncomplete = [...items].filter(item => !item.finished).length

        return {
            inputValue: '',
            filterState,
            countAll,
            countCompleted,
            countIncomplete,
            items,
            itemsToShow: this.getItemsToShow(items, filterState)
        }
    },

    /**
     * App methods
     */
    methods: {

        /**
         * Get items to show
         * @param items {array}
         * @param filterState {string}
         * @returns {*|*[]}
         */
        getItemsToShow(items, filterState) {

            //handle all
            if (filterState === 'all') return items

            //handle incomplete / completed
            return [...items].filter((item) => {
                if (filterState === 'incomplete') return item.finished === false
                if (filterState === 'complete') return item.finished === true
                return false
            })
        },

        /**
         * Handle filter state change
         * @param newValue {string}
         */
        handleFilterStateChange(newValue) {
            if (newValue && ['all', 'incomplete', 'complete'].includes(newValue)) {
                this.filterState = newValue
                this.itemsToShow = this.getItemsToShow(this.items, newValue)
                localStorage.setItem('filterState', newValue)
            }
        },

        /**
         * Update items in state and localStorage
         * @param newItems
         */
        updateItems(newItems) {
            //update items and items to show
            this.items = newItems
            this.itemsToShow = this.getItemsToShow(this.items, this.filterState)

            //update counts
            this.countAll = newItems.length
            this.countCompleted = [...newItems].filter(item => item.finished).length
            this.countIncomplete = [...newItems].filter(item => !item.finished).length

            //update LS
            localStorage.setItem('items', JSON.stringify(this.items))
        },

        /**
         * Adds an item to the to do list based on current input value
         * @param event
         */
        handleAddItem(event) {
            if (event) event.preventDefault()

            //add item
            this.updateItems([...this.items, {
                id: uuid(),
                order: this.items.length + 1,
                label: this.inputValue,
                finished: false
            }])

            //reset input value
            this.inputValue = ''
        },

        /**
         * Handle update item property
         * @param item
         * @param property
         * @param newValue
         */
        handleUpdateItem(item, property, newValue) {
            this.updateItems([...this.items].map((newItem) => {
                if (item.id === newItem.id) newItem[property] = newValue
                return newItem
            }))
        },

        /**
         * Handle delete item
         * @param itemToDelete
         */
        handleDeleteItem(itemToDelete) {
            const verify = confirm(`Are you sure that you want to delete task "${itemToDelete.label}"?`)
            if (verify) this.updateItems([...this.items].filter(item => item.id !== itemToDelete.id))
        }
    }
})

//mount app
app.mount('#app')