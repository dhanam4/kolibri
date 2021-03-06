<template>

  <KModal
    :title="$tr('modalTitle')"
    size="small"
    :submitText="$tr('update')"
    :cancelText="$tr('cancel')"
    :submitDisabled="submitting"
    @submit="updateName"
    @cancel="close"
  >
    <KTextbox
      ref="name"
      type="text"
      :label="$tr('classname')"
      :autofocus="true"
      :invalid="nameIsInvalid"
      :invalidText="nameIsInvalidText"
      :maxlength="50"
      @blur="nameBlurred = true"
      v-model.trim="name"
    />
  </KModal>

</template>


<script>

  import { mapActions } from 'vuex';
  import KModal from 'kolibri.coreVue.components.KModal';
  import KTextbox from 'kolibri.coreVue.components.KTextbox';

  export default {
    name: 'ClassRenameModal',
    $trs: {
      modalTitle: 'Change class name',
      classname: 'Class name',
      cancel: 'Cancel',
      update: 'Update',
      duplicateName: 'A class with that name already exists',
      required: 'This field is required',
    },
    components: {
      KModal,
      KTextbox,
    },
    props: {
      classname: {
        type: String,
        required: true,
      },
      classid: {
        type: String,
        required: true,
      },
      classes: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        name: this.classname,
        nameBlurred: false,
        formSubmitted: false,
        submitting: false,
      };
    },
    computed: {
      duplicateName() {
        // if same name, different case
        if (this.name.toUpperCase() === this.classname.toUpperCase()) {
          return false;
        }
        const index = this.classes.findIndex(
          classroom => classroom.name.toUpperCase() === this.name.toUpperCase()
        );
        if (index === -1) {
          return false;
        }
        return true;
      },
      nameIsInvalidText() {
        if (this.nameBlurred || this.formSubmitted) {
          if (this.name === '') {
            return this.$tr('required');
          }
          if (this.duplicateName) {
            return this.$tr('duplicateName');
          }
        }
        return '';
      },
      nameIsInvalid() {
        return Boolean(this.nameIsInvalidText);
      },
      formIsValid() {
        return !this.nameIsInvalid;
      },
    },
    methods: {
      ...mapActions('classEditManagement', ['updateClass', 'displayModal']),
      updateName() {
        this.formSubmitted = true;
        if (this.formIsValid) {
          this.submitting = true;
          this.updateClass({ id: this.classid, updateData: { name: this.name } });
        } else {
          this.$refs.name.focus();
        }
      },
      close() {
        this.displayModal(false);
      },
    },
  };

</script>


<style lang="scss" scoped></style>
