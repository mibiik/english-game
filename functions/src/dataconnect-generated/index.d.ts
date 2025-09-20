import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Achievement_Key {
  id: UUIDString;
  __typename?: 'Achievement_Key';
}

export interface CreateNewUserData {
  user_insert: User_Key;
}

export interface GetLessonData {
  lesson?: {
    title: string;
    description: string;
  };
}

export interface LearningModule_Key {
  id: UUIDString;
  __typename?: 'LearningModule_Key';
}

export interface Lesson_Key {
  id: UUIDString;
  __typename?: 'Lesson_Key';
}

export interface ListLearningModulesData {
  learningModules: ({
    id: UUIDString;
    name: string;
  } & LearningModule_Key)[];
}

export interface Question_Key {
  id: UUIDString;
  __typename?: 'Question_Key';
}

export interface UpdateLessonDescriptionData {
  lesson_update?: Lesson_Key | null;
}

export interface UserAchievement_Key {
  userId: UUIDString;
  achievementId: UUIDString;
  __typename?: 'UserAchievement_Key';
}

export interface UserProgress_Key {
  userId: UUIDString;
  lessonId: UUIDString;
  __typename?: 'UserProgress_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateNewUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateNewUserData, undefined>;
  operationName: string;
}
export const createNewUserRef: CreateNewUserRef;

export function createNewUser(): MutationPromise<CreateNewUserData, undefined>;
export function createNewUser(dc: DataConnect): MutationPromise<CreateNewUserData, undefined>;

interface GetLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLessonData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetLessonData, undefined>;
  operationName: string;
}
export const getLessonRef: GetLessonRef;

export function getLesson(): QueryPromise<GetLessonData, undefined>;
export function getLesson(dc: DataConnect): QueryPromise<GetLessonData, undefined>;

interface UpdateLessonDescriptionRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateLessonDescriptionData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateLessonDescriptionData, undefined>;
  operationName: string;
}
export const updateLessonDescriptionRef: UpdateLessonDescriptionRef;

export function updateLessonDescription(): MutationPromise<UpdateLessonDescriptionData, undefined>;
export function updateLessonDescription(dc: DataConnect): MutationPromise<UpdateLessonDescriptionData, undefined>;

interface ListLearningModulesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListLearningModulesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListLearningModulesData, undefined>;
  operationName: string;
}
export const listLearningModulesRef: ListLearningModulesRef;

export function listLearningModules(): QueryPromise<ListLearningModulesData, undefined>;
export function listLearningModules(dc: DataConnect): QueryPromise<ListLearningModulesData, undefined>;

