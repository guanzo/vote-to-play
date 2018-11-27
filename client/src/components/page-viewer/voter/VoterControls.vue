<template>
    <div class="vote-controls field is-grouped is-grouped-multiline">
        <div v-if="isWhitelist" class="whitelist-tip help has-text-centered m-b-5">
            {{ channelName }} has limited the voting pool
        </div>
        <slot v-if="!hideControls">
            <div /><!-- spacing helper -->
        </slot>
        <div v-if="!isAnonymousUser" class="control m-l-a">
            <button
                @click="submitVote"
                :disabled="!hasSelectedCandidate"
                class="button is-small"
                :class="{ 'is-loading': isLoading }"
            >
            Vote
            <span v-if="selectedVote">&nbsp;for {{ selectedVote }}</span>
            </button>
        </div>
        <div class="tag is-warning m-l-a" v-else>
            You must login to vote
        </div>
    </div>
</template>

<script>

import voteApi from '@/api/vote-api'
import { NAMESPACE as ALL_GAMES }   from '@/store/modules/games/allGames'
const { VOTE_MODE_STREAMER } = require('@shared/constants')

export default {
    name: 'voter-controls',
    props:{
        hasSelectedCandidate: Boolean,
        hasSubmittedVote: Boolean,
        selectedVote: String
    },
    data(){
        return {
            isLoading: false,
        }
    },
    computed:{
        ...Vuex.mapState([
            'userId','voteCategory','voteMode', 'channelId', 'channelName'
        ]),
        ...Vuex.mapGetters(['isAnonymousUser']),
        preventVote(){
            return this.hasSubmittedVote || this.isLoading
        },
        isWhitelist(){
            return this.voteMode === VOTE_MODE_STREAMER
		},//for all games whitelist, no point in allowing game searches.
		hideControls(){
			return this.isWhitelist && this.voteCategory === ALL_GAMES
		}
    },
    watch:{
        hasSubmittedVote (){
            if(this.hasSubmittedVote) {
                this.isLoading = false
            }
        }
    },
    methods:{
        async submitVote (){
            if(this.preventVote) {
                return
            }
            this.isLoading = true

            const { userId, selectedVote } = this
            try {
                await voteApi.addVote(userId, selectedVote)
            } catch (e) {
                this.isLoading = false
                return
            }
            this.$emit('submittedVote')
        },
    }
}

</script>

<style lang="scss">
$input-max-width: 100px;
.vote-controls{
    grid-area: footer;
    position: relative;
    //display: flex;
    //justify-content: space-between;
    transition: .5s;
    select, input[type="text"] {
        max-width: $input-max-width;
    }
	.whitelist-tip{
		width: 100%;
	}
}
</style>
