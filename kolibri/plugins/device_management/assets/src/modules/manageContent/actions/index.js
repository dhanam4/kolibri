import { ChannelResource } from 'kolibri.resources';
import { ContentWizardPages, TransferTypes } from '../../../constants';
import * as taskActions from './taskActions';

function refreshChannelList(store) {
  store.commit('SET_CHANNEL_LIST_LOADING', true);
  return ChannelResource.fetchCollection({
    getParams: { include_fields: 'on_device_file_size' },
    force: true,
  }).then(channels => {
    store.commit('SET_CHANNEL_LIST', [...channels]);
    store.commit('SET_CHANNEL_LIST_LOADING', false);
    return [...channels];
  });
}

function startImportWorkflow(store, channel) {
  if (channel) {
    store.commit('wizard/SET_TRANSFERRED_CHANNEL', channel);
  }
  store.commit('wizard/SET_WIZARD_PAGENAME', ContentWizardPages.SELECT_IMPORT_SOURCE);
}

function startExportWorkflow(store) {
  store.commit('wizard/SET_TRANSFER_TYPE', TransferTypes.LOCALEXPORT);
  store.commit('wizard/SET_WIZARD_PAGENAME', ContentWizardPages.SELECT_DRIVE);
}

export default {
  ...taskActions,
  refreshChannelList,
  startImportWorkflow,
  startExportWorkflow,
};
