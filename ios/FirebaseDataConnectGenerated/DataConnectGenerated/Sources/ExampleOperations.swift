import Foundation

import FirebaseCore
import FirebaseDataConnect




















// MARK: Common Enums

public enum OrderDirection: String, Codable, Sendable {
  case ASC = "ASC"
  case DESC = "DESC"
  }

public enum SearchQueryFormat: String, Codable, Sendable {
  case QUERY = "QUERY"
  case PLAIN = "PLAIN"
  case PHRASE = "PHRASE"
  case ADVANCED = "ADVANCED"
  }


// MARK: Connector Enums

// End enum definitions









public class CreateNewUserMutation{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "CreateNewUser"

  public typealias Ref = MutationRef<CreateNewUserMutation.Data,CreateNewUserMutation.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {



public var 
user_insert: UserKey

  }

  public func ref(
        
        ) -> MutationRef<CreateNewUserMutation.Data,CreateNewUserMutation.Variables>  {
        var variables = CreateNewUserMutation.Variables()
        

        let ref = dataConnect.mutation(name: "CreateNewUser", variables: variables, resultsDataType:CreateNewUserMutation.Data.self)
        return ref as MutationRef<CreateNewUserMutation.Data,CreateNewUserMutation.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<CreateNewUserMutation.Data> {
        var variables = CreateNewUserMutation.Variables()
        
        
        let ref = dataConnect.mutation(name: "CreateNewUser", variables: variables, resultsDataType:CreateNewUserMutation.Data.self)
        
        return try await ref.execute()
        
   }
}






public class GetLessonQuery{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "GetLesson"

  public typealias Ref = QueryRefObservation<GetLessonQuery.Data,GetLessonQuery.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {




public struct Lesson: Decodable, Sendable  {
  


public var 
title: String



public var 
description: String


  

  
  enum CodingKeys: String, CodingKey {
    
    case title
    
    case description
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.title = try codecHelper.decode(String.self, forKey: .title, container: &container)
    
    
    
    self.description = try codecHelper.decode(String.self, forKey: .description, container: &container)
    
    
  }
}
public var 
lesson: Lesson?

  }

  public func ref(
        
        ) -> QueryRefObservation<GetLessonQuery.Data,GetLessonQuery.Variables>  {
        var variables = GetLessonQuery.Variables()
        

        let ref = dataConnect.query(name: "GetLesson", variables: variables, resultsDataType:GetLessonQuery.Data.self, publisher: .observableMacro)
        return ref as! QueryRefObservation<GetLessonQuery.Data,GetLessonQuery.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<GetLessonQuery.Data> {
        var variables = GetLessonQuery.Variables()
        
        
        let ref = dataConnect.query(name: "GetLesson", variables: variables, resultsDataType:GetLessonQuery.Data.self, publisher: .observableMacro)
        
        let refCast = ref as! QueryRefObservation<GetLessonQuery.Data,GetLessonQuery.Variables>
        return try await refCast.execute()
        
   }
}






public class UpdateLessonDescriptionMutation{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "UpdateLessonDescription"

  public typealias Ref = MutationRef<UpdateLessonDescriptionMutation.Data,UpdateLessonDescriptionMutation.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {



public var 
lesson_update: LessonKey?

  }

  public func ref(
        
        ) -> MutationRef<UpdateLessonDescriptionMutation.Data,UpdateLessonDescriptionMutation.Variables>  {
        var variables = UpdateLessonDescriptionMutation.Variables()
        

        let ref = dataConnect.mutation(name: "UpdateLessonDescription", variables: variables, resultsDataType:UpdateLessonDescriptionMutation.Data.self)
        return ref as MutationRef<UpdateLessonDescriptionMutation.Data,UpdateLessonDescriptionMutation.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<UpdateLessonDescriptionMutation.Data> {
        var variables = UpdateLessonDescriptionMutation.Variables()
        
        
        let ref = dataConnect.mutation(name: "UpdateLessonDescription", variables: variables, resultsDataType:UpdateLessonDescriptionMutation.Data.self)
        
        return try await ref.execute()
        
   }
}






public class ListLearningModulesQuery{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "ListLearningModules"

  public typealias Ref = QueryRefObservation<ListLearningModulesQuery.Data,ListLearningModulesQuery.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {




public struct LearningModule: Decodable, Sendable ,Hashable, Equatable, Identifiable {
  


public var 
id: UUID



public var 
name: String


  
  public var learningModuleKey: LearningModuleKey {
    return LearningModuleKey(
      
      id: id
    )
  }

  
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(id)
  
}
public static func == (lhs: LearningModule, rhs: LearningModule) -> Bool {
    
    return lhs.id == rhs.id 
        
  }

  

  
  enum CodingKeys: String, CodingKey {
    
    case id
    
    case name
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
    
    
    self.name = try codecHelper.decode(String.self, forKey: .name, container: &container)
    
    
  }
}
public var 
learningModules: [LearningModule]

  }

  public func ref(
        
        ) -> QueryRefObservation<ListLearningModulesQuery.Data,ListLearningModulesQuery.Variables>  {
        var variables = ListLearningModulesQuery.Variables()
        

        let ref = dataConnect.query(name: "ListLearningModules", variables: variables, resultsDataType:ListLearningModulesQuery.Data.self, publisher: .observableMacro)
        return ref as! QueryRefObservation<ListLearningModulesQuery.Data,ListLearningModulesQuery.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<ListLearningModulesQuery.Data> {
        var variables = ListLearningModulesQuery.Variables()
        
        
        let ref = dataConnect.query(name: "ListLearningModules", variables: variables, resultsDataType:ListLearningModulesQuery.Data.self, publisher: .observableMacro)
        
        let refCast = ref as! QueryRefObservation<ListLearningModulesQuery.Data,ListLearningModulesQuery.Variables>
        return try await refCast.execute()
        
   }
}


