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
import { TweenLite, Linear } from 'gsap';

@Component
export default class extends Vue {
  @State('total') totalState!: Total;
  tweened = 0;

  created(): void {
    this.tweened = this.totalState;
  }

  @Watch('totalState')
  onTotalChange(newVal: Total, oldVal: Total): void {
    TweenLite.to({ total: oldVal }, 1, {
      total: newVal,
      ease: Linear.easeNone,
      onUpdateParams: ['{self}'],
      onUpdate: (self: { target: { total: number }}) => {
        this.tweened = self.target.total;
      },
    });
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
