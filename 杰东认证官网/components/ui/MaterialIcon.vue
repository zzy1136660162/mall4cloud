<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string;
    filled?: boolean;
  }>(),
  {
    filled: false
  }
);

const iconUrl = computed(() => `url("/images/icons/${props.name}.svg")`);
</script>

<template>
  <i
    class="inline-block h-[1em] w-[1em] shrink-0 bg-current align-[-0.125em]"
    :style="{
      mask: `${iconUrl} center / contain no-repeat`,
      WebkitMask: `${iconUrl} center / contain no-repeat`
    }"
    aria-hidden="true"
  />
</template>
