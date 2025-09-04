const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'wordplay',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createNewUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser');
}
createNewUserRef.operationName = 'CreateNewUser';
exports.createNewUserRef = createNewUserRef;

exports.createNewUser = function createNewUser(dc) {
  return executeMutation(createNewUserRef(dc));
};

const getLessonRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLesson');
}
getLessonRef.operationName = 'GetLesson';
exports.getLessonRef = getLessonRef;

exports.getLesson = function getLesson(dc) {
  return executeQuery(getLessonRef(dc));
};

const updateLessonDescriptionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLessonDescription');
}
updateLessonDescriptionRef.operationName = 'UpdateLessonDescription';
exports.updateLessonDescriptionRef = updateLessonDescriptionRef;

exports.updateLessonDescription = function updateLessonDescription(dc) {
  return executeMutation(updateLessonDescriptionRef(dc));
};

const listLearningModulesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListLearningModules');
}
listLearningModulesRef.operationName = 'ListLearningModules';
exports.listLearningModulesRef = listLearningModulesRef;

exports.listLearningModules = function listLearningModules(dc) {
  return executeQuery(listLearningModulesRef(dc));
};
