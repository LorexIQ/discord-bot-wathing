<template>
  <svg style="width: 0; height: 0">
    <mask id="svg-mask-status-online" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="#FFFFFF" cx="0.5" cy="0.5" r="0.5"></circle></mask>
    <mask id="svg-mask-status-idle" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="#FFFFFF" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="0.25" cy="0.25" r="0.375"></circle></mask>
    <mask id="svg-mask-status-dnd" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="#FFFFFF" cx="0.5" cy="0.5" r="0.5"></circle><rect fill="black" x="0.125" y="0.375" width="0.75" height="0.25" rx="0.125" ry="0.125"></rect></mask>
    <mask id="svg-mask-status-offline" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="#FFFFFF" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="0.5" cy="0.5" r="0.25"></circle></mask>
  </svg>
</template>

<script>
export default {
  name: "svgMask"
}
</script>
