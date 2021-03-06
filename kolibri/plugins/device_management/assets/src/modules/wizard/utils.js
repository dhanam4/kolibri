import { ChannelResource, RemoteChannelResource, TaskResource } from 'kolibri.resources';
import { ErrorTypes } from '../../constants';
import { waitForTaskToComplete } from '../manageContent/utils';

/**
 * Makes request to RemoteChannel API with a token. Does not actually interact
 * with Vuex store.
 *
 * @param {string} token -
 * @returns Promise
 */
export function getRemoteChannelByToken(token) {
  return RemoteChannelResource.fetchModel({ id: token, force: true });
}

/**
 * Starts Task that downloads a Channel Metadata database.
 * NOTE: cannot be normally dispatched as an action, since it uses
 * waitForTaskToComplete (which relies on the store singleton with a .watch method)
 *
 */
export function downloadChannelMetadata(store) {
  const { transferredChannel, selectedDrive } = store.state.manageContent.wizard;
  let promise;
  if (store.getters['manageContent/wizard/inLocalImportMode']) {
    promise = TaskResource.startDiskChannelImport({
      channel_id: transferredChannel.id,
      drive_id: selectedDrive.id,
    });
  } else if (store.getters['manageContent/wizard/inRemoteImportMode']) {
    promise = TaskResource.startRemoteChannelImport({
      channel_id: transferredChannel.id,
    });
  } else {
    return Error('Channel Metadata is only downloaded when importing');
  }
  promise = promise.catch(() => Promise.reject({ errorType: ErrorTypes.CONTENT_DB_LOADING_ERROR }));

  return promise
    .then(task => {
      // NOTE: store.watch is not available to dispatched actions
      return waitForTaskToComplete(store, task.entity.id);
    })
    .then(completedTask => {
      const { taskId, cancelled } = completedTask;
      if (taskId && !cancelled) {
        return TaskResource.cancelTask(taskId).then(() => {
          return ChannelResource.fetchModel({
            id: transferredChannel.id,
            getParams: {
              include_fields: [
                'total_resources',
                'total_file_size',
                'on_device_resources',
                'on_device_file_size',
              ],
            },
          });
        });
      }
      return Promise.reject({ errorType: ErrorTypes.CHANNEL_TASK_ERROR });
    });
}
