import { DeviceProvisionResource } from 'kolibri.resources';
import { currentLanguage } from 'kolibri.utils.i18n';

export default {
  state: {
    onboardingData: {
      // Set in DefaultLanguageForm
      language_id: currentLanguage,
      // Set in FacilityPermissionsForm
      facility: {
        name: '',
      },
      preset: 'nonformal',
      // Keys match schema of FacilityDatasetModel
      settings: {
        // Set in GuessAccessForm
        allow_guest_access: null,
        // Set in CreateLearnerAccountForm
        learner_can_sign_up: null,
        learner_can_edit_name: null,
        learner_can_edit_username: null,
        // Set in RequirePasswordForLearnersForm
        learner_can_login_with_no_password: null,
      },
      // Set in SuperuserCredentialsForm
      superuser: {
        full_name: '',
        username: '',
        password: '',
      },
    },
    loading: false,
    error: false,
    onboardingStep: 1,
  },
  actions: {
    provisionDevice(store, onboardingData) {
      // Make a copy so data is available when 'kolibriLogin' is called
      const superuser = { ...onboardingData.superuser };
      store.commit('SET_LOADING', true);

      return DeviceProvisionResource.saveModel({ data: onboardingData }).then(
        response => {
          superuser.facility = response.facility.id;
          store.dispatch('kolibriLogin', superuser);
        },
        error => {
          store.commit('SET_ERROR', true);
          store.dispatch('handleApiError', error);
        }
      );
    },
  },
  mutations: {
    SET_LANGUAGE(state, language_id) {
      state.onboardingData.language_id = language_id;
    },
    SET_FACILITY_NAME(state, name) {
      state.onboardingData.facility.name = name;
    },
    SET_SU(state, { name, username, password }) {
      state.onboardingData.superuser.username = username;
      state.onboardingData.superuser.full_name = name;
      state.onboardingData.superuser.password = password;
    },
    SET_FACILITY_PRESET(state, preset) {
      state.onboardingData.preset = preset;
    },
    SET_ALLOW_GUEST_ACCESS(state, setting) {
      state.onboardingData.settings.allow_guest_access = setting;
    },
    SET_LEARNER_CAN_SIGN_UP(state, setting) {
      // These three options are set together
      state.onboardingData.settings.learner_can_sign_up = setting;
      state.onboardingData.settings.learner_can_edit_name = setting;
      state.onboardingData.settings.learner_can_edit_username = setting;
    },
    SET_LEARNER_CAN_LOGIN_WITH_NO_PASSWORD(state, setting) {
      state.onboardingData.settings.learner_can_login_with_no_password = setting;
    },
    SET_LOADING(state, loadingFlag) {
      state.loading = loadingFlag;
    },
    SET_ERROR(state, errorFlag) {
      state.error = errorFlag;
    },
    INCREMENT_ONBOARDING_STEP(state) {
      state.onboardingStep++;
    },
    DECREMENT_ONBOARDING_STEP(state) {
      state.onboardingStep--;
    },
    SET_ONBOARDING_STEP(state, step) {
      state.onboardingStep = step;
    },
  },
};
