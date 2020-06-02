<template>
  <div
    ref="Donation"
    :style="{ overflow: 'hidden' }"
  >
    <b>New Donation:</b> {{ text }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

interface DonationObj {
  id: number;
  donor_visiblename: string; // eslint-disable-line camelcase
  amount: string;
  comment: string;
}

@Component
export default class extends Vue {
  @Prop(Object) donation!: DonationObj;
  @Ref('Donation') readonly elem!: HTMLElement;

  get text(): string {
    return `${this.donation.donor_visiblename} ($${parseFloat(this.donation.amount).toFixed(2)})`
      + `${(this.donation.comment) ? ` - ${this.donation.comment}` : ''}`;
  }

  mounted(): void {
    const fullWidth = this.elem.scrollWidth;
    const visibleWidth = this.elem.clientWidth;
    // Display time is minimum of 10s.
    let time = 10;
    if (fullWidth > visibleWidth) {
      const dist = fullWidth - visibleWidth;
      time = ((dist / 100) > 10) ? (dist / 100) : 10;
    }
    gsap.to(this.elem, {
      scrollTo: { x: 'max' },
      delay: 2,
      ease: 'none',
      onComplete: () => {
        setTimeout(() => this.$emit('end'), 2 * 1000);
      },
    }).duration(time);
  }
}
</script>
