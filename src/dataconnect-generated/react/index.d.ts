import { CreateNewUserData, GetLessonData, UpdateLessonDescriptionData, ListLearningModulesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewUser(options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateNewUserData, undefined>;
export function useCreateNewUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateNewUserData, undefined>;

export function useGetLesson(options?: useDataConnectQueryOptions<GetLessonData>): UseDataConnectQueryResult<GetLessonData, undefined>;
export function useGetLesson(dc: DataConnect, options?: useDataConnectQueryOptions<GetLessonData>): UseDataConnectQueryResult<GetLessonData, undefined>;

export function useUpdateLessonDescription(options?: useDataConnectMutationOptions<UpdateLessonDescriptionData, FirebaseError, void>): UseDataConnectMutationResult<UpdateLessonDescriptionData, undefined>;
export function useUpdateLessonDescription(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateLessonDescriptionData, FirebaseError, void>): UseDataConnectMutationResult<UpdateLessonDescriptionData, undefined>;

export function useListLearningModules(options?: useDataConnectQueryOptions<ListLearningModulesData>): UseDataConnectQueryResult<ListLearningModulesData, undefined>;
export function useListLearningModules(dc: DataConnect, options?: useDataConnectQueryOptions<ListLearningModulesData>): UseDataConnectQueryResult<ListLearningModulesData, undefined>;
