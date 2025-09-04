import Foundation

import FirebaseDataConnect



public struct AchievementKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension AchievementKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension AchievementKey : Equatable {
  public static func == (lhs: AchievementKey, rhs: AchievementKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension AchievementKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension AchievementKey : Sendable {}



public struct LearningModuleKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension LearningModuleKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension LearningModuleKey : Equatable {
  public static func == (lhs: LearningModuleKey, rhs: LearningModuleKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension LearningModuleKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension LearningModuleKey : Sendable {}



public struct LessonKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension LessonKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension LessonKey : Equatable {
  public static func == (lhs: LessonKey, rhs: LessonKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension LessonKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension LessonKey : Sendable {}



public struct QuestionKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension QuestionKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension QuestionKey : Equatable {
  public static func == (lhs: QuestionKey, rhs: QuestionKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension QuestionKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension QuestionKey : Sendable {}



public struct UserAchievementKey {
  
  public private(set) var userId: UUID
  
  public private(set) var achievementId: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  userId
    
    case  achievementId
    
  }
}

extension UserAchievementKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.userId = try codecHelper.decode(UUID.self, forKey: .userId, container: &container)
    
    self.achievementId = try codecHelper.decode(UUID.self, forKey: .achievementId, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(userId, forKey: .userId, container: &container)
      
      
      
      try codecHelper.encode(achievementId, forKey: .achievementId, container: &container)
      
      
    }
}

extension UserAchievementKey : Equatable {
  public static func == (lhs: UserAchievementKey, rhs: UserAchievementKey) -> Bool {
    
    if lhs.userId != rhs.userId {
      return false
    }
    
    if lhs.achievementId != rhs.achievementId {
      return false
    }
    
    return true
  }
}

extension UserAchievementKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.userId)
    
    hasher.combine(self.achievementId)
    
  }
}

extension UserAchievementKey : Sendable {}



public struct UserProgressKey {
  
  public private(set) var userId: UUID
  
  public private(set) var lessonId: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  userId
    
    case  lessonId
    
  }
}

extension UserProgressKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.userId = try codecHelper.decode(UUID.self, forKey: .userId, container: &container)
    
    self.lessonId = try codecHelper.decode(UUID.self, forKey: .lessonId, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(userId, forKey: .userId, container: &container)
      
      
      
      try codecHelper.encode(lessonId, forKey: .lessonId, container: &container)
      
      
    }
}

extension UserProgressKey : Equatable {
  public static func == (lhs: UserProgressKey, rhs: UserProgressKey) -> Bool {
    
    if lhs.userId != rhs.userId {
      return false
    }
    
    if lhs.lessonId != rhs.lessonId {
      return false
    }
    
    return true
  }
}

extension UserProgressKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.userId)
    
    hasher.combine(self.lessonId)
    
  }
}

extension UserProgressKey : Sendable {}



public struct UserKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension UserKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension UserKey : Equatable {
  public static func == (lhs: UserKey, rhs: UserKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension UserKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension UserKey : Sendable {}


