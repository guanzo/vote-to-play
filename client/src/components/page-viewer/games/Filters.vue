// put

<template v-if="game.filters" slot="filters">
                    <div v-for="filter in game.filters" class="control" :key="filter.id">
                        <input v-if="filter.type == 'text'" 
                                v-model="filter.vmodel" 
                                :placeholder="filter.placeholder"
                                type="text"
                                class="input" :class="formClass"
                        >
                        <div v-else-if="filter.type == 'select'" class="select" :class="formClass">
                            <select v-model="filter.vmodel">
                                <option v-for="role in filter.options" :key="role">{{ role }}</option>
                            </select>
                        </div>
                    </div>
                </template>

                IN HERE and OUT of Game.Vue