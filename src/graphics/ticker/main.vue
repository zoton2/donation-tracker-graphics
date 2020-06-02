<template>
  <div
    :style="{
      'font-family': 'Arial',
      width: '100%',
      height: '100vh',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'font-size': '40px',
      'white-space': 'nowrap',
    }"
  >
    <transition
      name="fade"
      mode="out-in"
    >
      <donation
        v-if="donation"
        :key="donation.id"
        :donation="donation"
        @end="onEnd"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Donation from './components/Donation.vue';

interface DonationObj {
  id: number;
  donor_visiblename: string; // eslint-disable-line camelcase
  amount: string;
  comment: string;
}

@Component({
  components: {
    Donation,
  },
})
export default class extends Vue {
  donations: DonationObj[] = [];
  donation: DonationObj | null = null;
  showing = false;

  created(): void {
    nodecg.listenFor('newDonation', (donation: DonationObj) => {
      this.donations.push(donation);
      if (!this.showing) {
        this.showNext();
      }
    });
  }

  showNext(): void {
    [this.donation] = this.donations;
    this.showing = true;
    this.donations.shift();
  }

  onEnd(): void {
    if (!this.donations.length) {
      this.showing = false;
      this.donation = null;
    } else {
      this.showNext();
    }
  }
}
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
