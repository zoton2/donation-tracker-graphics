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
    }"
  >
    <span
      v-for="(char, i) in total"
      :key="i"
      :style="{
        display: 'inline-block',
        width: (char === ',') ? '0.22em' : '0.5em',
        'text-align': 'center',
      }"
    >
      {{ char }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Total } from 'schemas';
import { gsap } from 'gsap';

@Component
export default class extends Vue {
  @State('total') totalState!: Total;
  tweened = 0;

  created(): void {
    this.tweened = this.totalState;
  }

  @Watch('totalState')
  onTotalChange(newVal: Total, oldVal: Total): void {
    gsap.to({ total: oldVal }, {
      total: newVal,
      ease: 'none',
      onUpdateParams: [this],
      onUpdate(vue) {
        Vue.set(vue, 'tweened', this.targets()[0].total);
      },
    }).duration(1);
  }
  get total(): string {
    return `$${this.tweened.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
