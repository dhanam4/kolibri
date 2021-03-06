<template>

  <nav>
    <button
      v-show="!enoughSpace"
      class="k-navbar-scroll-button"
      @click="isRtl ? scrollRight() : scrollLeft()"
    >
      <mat-svg
        name="keyboard_arrow_left"
        category="hardware"
        :class="{ 'rtl-icon': isRtl }"
      />
    </button>

    <ul
      ref="navbarUl"
      class="k-navbar"
      :style="{ maxWidth: `${ maxWidth }px` }"
    >
      <!-- Contains KNavbarLink components -->
      <slot></slot>
    </ul>

    <button
      v-show="!enoughSpace"
      class="k-navbar-scroll-button"
      @click="isRtl ? scrollLeft() : scrollRight()"
    >
      <mat-svg
        name="keyboard_arrow_right"
        category="hardware"
        :class="{ 'rtl-icon': isRtl }"
      />
    </button>
  </nav>

</template>


<script>

  import responsiveElement from 'kolibri.coreVue.mixins.responsiveElement';
  import throttle from 'lodash/throttle';

  /**
   * Used for navigation between sub-pages of a top-level Kolibri section
   */
  export default {
    name: 'KNavbar',
    mixins: [responsiveElement],
    data: () => ({
      enoughSpace: true,
    }),
    computed: {
      maxWidth() {
        return this.enoughSpace ? this.elementWidth : this.elementWidth - 38 * 2;
      },
    },
    mounted() {
      this.checkSpace();
      this.$watch('elementWidth', this.throttleCheckSpace);
    },
    methods: {
      checkSpace() {
        const availableWidth = this.elementWidth;
        const items = this.$children;
        let widthOfItems = 0;
        items.forEach(item => {
          const itemWidth = Math.ceil(item.$el.getBoundingClientRect().width);
          widthOfItems += itemWidth;
        });
        this.enoughSpace = widthOfItems <= availableWidth;
      },
      throttleCheckSpace: throttle(function() {
        this.checkSpace();
      }, 100),
      scrollLeft() {
        this.$refs.navbarUl.scrollLeft -= this.maxWidth;
      },
      scrollRight() {
        this.$refs.navbarUl.scrollLeft += this.maxWidth;
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri.styles.definitions';

  .k-navbar {
    display: inline-block;
    padding: 0;
    margin: 0;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    vertical-align: middle;
  }

  .k-navbar-scroll-button {
    width: 36px;
    height: 36px;
    vertical-align: middle;
    &:focus {
      outline: $core-outline;
    }
  }

</style>
