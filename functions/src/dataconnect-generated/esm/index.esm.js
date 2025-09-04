import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'wordplay',
  location: 'us-central1'
};

export const createNewUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser');
}
createNewUserRef.operationName = 'CreateNewUser';

export function createNewUser(dc) {
  return executeMutation(createNewUserRef(dc));
}

export const getLessonRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLesson');
}
getLessonRef.operationName = 'GetLesson';

export function getLesson(dc) {
  return executeQuery(getLessonRef(dc));
}

export const updateLessonDescriptionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLessonDescription');
}
updateLessonDescriptionRef.operationName = 'UpdateLessonDescription';

export function updateLessonDescription(dc) {
  return executeMutation(updateLessonDescriptionRef(dc));
}

export const listLearningModulesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListLearningModules');
}
listLearningModulesRef.operationName = 'ListLearningModules';

export function listLearningModules(dc) {
  return executeQuery(listLearningModulesRef(dc));
}

