<template>

  <button
    ref="button"
    :class="buttonClasses"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ text }}
    <mat-svg
      v-if="hasDropdown"
      category="navigation"
      name="arrow_drop_down"
      class="dropdown-arrow"
    />
  </button>

</template>


<script>

  import { validator } from './appearances.js';
  import buttonClassesMixin from './buttonClassesMixin.js';

  /**
   * The KButton component is used to trigger actions
   */
  export default {
    name: 'KButton',
    mixins: [buttonClassesMixin],
    props: {
      /**
       * Button label text
       */
      text: {
        type: String,
        required: true,
      },
      /**
       * Button appearance: 'raised-button', 'flat-button', or 'basic-link'
       */
      appearance: {
        type: String,
        default: 'raised-button',
        validator,
      },
      /**
       * For 'raised-button' and 'flat-button' appearances: show as primary or secondary style
       */
      primary: {
        type: Boolean,
        default: false,
      },
      /**
       * Whether or not button is disabled
       */
      disabled: {
        type: Boolean,
        default: false,
      },
      /**
       * HTML button 'type' attribute (e.g. 'submit', 'reset')
       */
      type: {
        type: String,
        default: 'button',
      },
      /**
       * @private
       * Adds a dropdown arrow
       */
      hasDropdown: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    methods: {
      handleClick(event) {
        /**
         * Emitted when the button is triggered
         */
        this.$emit('click', event);
        this.$refs.button && this.$refs.button.blur();
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import './buttons';

  .dropdown-arrow {
    vertical-align: middle;
  }

</style>
