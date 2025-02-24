export interface AllItemsAPI {
  AllItems: Record<string, Item>;
}

export interface Item {
  Tags: string[];
  Fuel: number;
  PropertyInfos: PropertyInfos;
}

/** 
Nutrition.Nutrients = "- \u003Ccolor=#F54F12FF\u003ECarbs: \u003Cmspace=0.5em\u003E\u003Cpos=4.0em\u003E   9,0\u003C/pos\u003E\u003C/mspace\u003E\u003C/color\u003E\n- \u003Ccolor=#FFAE00FF\u003EProtein: \u003Cmspace=0.5em\u003E\u003Cpos=4.0em\u003E   3,0\u003C/pos\u003E\u003C/mspace\u003E\u003C/color\u003E\n- \u003Ccolor=#FFD21AFF\u003EFat: \u003Cmspace=0.5em\u003E\u003Cpos=4.0em\u003E  10,0\u003C/pos\u003E\u003C/mspace\u003E\u003C/color\u003E\n- \u003Ccolor=#A7D20FFF\u003EVitamins: \u003Cmspace=0.5em\u003E\u003Cpos=4.0em\u003E   2,0\u003C/pos\u003E\u003C/mspace\u003E\u003C/color\u003E"
*/
export interface PropertyInfos {
  DisplayNamePlural: BrokenDescription;
  UIName?: ArrowPrefab;
  IconName: ArrowPrefab;
  IconComment: ArrowPrefab;
  TypeID: DrillDepth;
  Type: CivicObjectType;
  DisplayName: BrokenDescription;
  Name: ArrowPrefab;
  IsUnique: Broken;
  Fuel: Calories;
  IsFuel: Broken;
  WeightWithoutModifiers: DrillDepth;
  Weight: DrillDepth;
  HasWeight: Broken;
  IsCarried: Broken;
  IgnoreAuth: Broken;
  Yield: Yield;
  HasYield: Broken;
  HasCrop: Broken;
  CanBeCurrency: Broken;
  MakesRoads: Broken;
  Compostable: Broken;
  ResourcePile: Broken;
  CanAirInteraction: Broken;
  Category: ArrowPrefab;
  Hidden: Broken;
  Group: ArrowPrefab;
  MaxStackSize: DrillDepth;
  IsWasteProduct: Broken;
  GetDescription: BrokenDescription;
  HandOrigin: HandOrigin;
  CanBeHeld: Broken;
  IsTool: Broken;
  CustomHighlight: Broken;
  Clone: Clone;
  MarkedUpName: BrokenDescription;
  ControllerID: ControllerID;
  Notifications?: DrillDepth;
  Slot?: ArrowPrefab;
  Starter?: Broken;
  BlockTypes?: BlockTypes;
  OriginType?: CivicObjectType;
  IgnoreRooms?: Broken;
  CanStickToWalls?: Broken;
  DisplayCrate?: Broken;
  HasTier?: Broken;
  Tier?: Tier;
  HasForms?: Broken;
  SpeciesName?: BrokenDescription;
  Calories?: Calories;
  Nutrition?: Nutrition;
  Species?: Species;
  SpoilageTime?: SpoilageTime;
  DefaultMinRequiredDurabilityInTradeOffers?: Calories;
  OriginalMaxDurability?: Calories;
  Decays?: Broken;
  DurabilityPercent?: Calories;
  PercentBrokenFromOriginal?: Calories;
  DisplayDurability?: ArrowPrefab;
  Broken?: Broken;
  BrokenDescription?: BrokenDescription;
  DisplayDescription?: BrokenDescription;
  Nutrients?: Nutrients;
  SkilledRepairCost?: CaloriesBurn;
  Durability?: Calories;
  CurrentMaxDurability?: Calories;
  RepairPenaltyToDurability?: Calories;
  RepairItem?: Clone;
  RepairItems?: Benefits;
  RepairTag?: RepairTag;
  FullRepairAmount?: DrillDepth;
  SkillReqs?: SkillReqs;
  Settlement?: Settlement;
  Subscriptions?: Subscriptions;
  ReducesMaxDurabilityByPercent?: Calories;
  Picture?: Picture;
  HomeValue?: HomeValue;
  PersistentData?: PersistentData;
  WorldObjectType?: CivicObjectType;
  ShouldCreate?: Broken;
  ShowLocationsInWorld?: Broken;
  OccupancyContext?: OccupancyContextClass;
  Blockers?: Blockers;
  Label?: BrokenDescription;
  Color?: Color;
  ColorName?: BrokenDescription;
  SkillType?: CivicObjectType;
  SkillScrollType?: CivicObjectType;
  Skill?: Skill;
  SkillBookType?: CivicObjectType;
  MultiStrategy?: MultiStrategy;
  AddStrategy?: AddStrategy;
  MaxLevel?: DrillDepth;
  Level?: DrillDepth;
  Experience?: Calories;
  Education?: Calories;
  StarsSpent?: DrillDepth;
  Teacher?: Teacher;
  TimeLearned?: TimeLearned;
  Prerequisites?: Prerequisites;
  IsRoot?: Broken;
  IsSpecialty?: Broken;
  RootSkillTree?: SkillTree;
  SpecialtySkillTree?: SkillTree;
  SkillTree?: SkillTree;
  Talents?: Talents;
  ExperienceToLevel?: Calories;
  PercentTowardsNextLevel?: Calories;
  Title?: ArrowPrefab;
  Multiplier?: Calories;
  CanBeRefunded?: Broken;
  TalentStrings?: Benefits;
  TalentsEnabled?: Broken;
  CaloriesBurn?: CaloriesBurn;
  ExperienceSkill?: CivicObjectType;
  ExperienceRate?: CaloriesBurn;
  DurabilityBurn?: CaloriesBurn;
  PerkDamage?: CaloriesBurn;
  Damage?: CaloriesBurn;
  MaxTake?: DrillDepth;
  CanBeUsedWithEmotes?: Broken;
  DescribeBlockAction?: DescribeBlockAction;
  Deed?: Deed;
  FireVelocity?: Calories;
  DrawTime?: Calories;
  ArrowPrefab?: ArrowPrefab;
  CanHoldToPaint?: Broken;
  Lure?: Lure;
  ProspectSpeed?: Calories;
  DrillDepth?: DrillDepth;
  AreaOfEffectMode?: AreaOfEffectMode;
  GenericMultiplier?: Calories;
  SkillMultiplier?: Calories;
  SkillTypeID?: DrillDepth;
  Benefits?: Benefits;
  ModuleTypes?: ModuleTypesClass;
  Blueprint?: Blueprint;
  SettlementType?: SettlementType;
  InteractDistance?: Calories;
  User?: Teacher;
  CivicObjectType?: CivicObjectType;
  RequiresSurfaceOnSides?: RequiresSurfaceOnSides;
  RepresentedItemType?: CivicObjectType;
}

export interface AddStrategy {
  AdditiveStrategy: AdditiveStrategy;
}

export enum AdditiveStrategy {
  EcoGameplayDynamicValuesAdditiveStrategy = "Eco.Gameplay.DynamicValues.AdditiveStrategy",
}

export interface AreaOfEffectMode {
  AreaOfEffectMode: string;
}

export interface ArrowPrefab {
  String: string;
}

export interface Benefits {
  "IEnumerable`1": string;
}

export interface BlockTypes {
  "Type[]"?: Type;
  "Dictionary`2"?: string;
}

export enum Type {
  SystemType = "System.Type[]",
}

export interface Blockers {
  "Type[]": Type;
}

export interface Blueprint {
  Blueprint: string;
}

export interface Broken {
  Boolean: boolean;
}

export enum Boolean {
  False = "False",
  True = "True",
}

export interface BrokenDescription {
  LocString: string;
}

export interface Calories {
  Single: string;
}

export interface CaloriesBurn {
  IDynamicValue: IDynamicValue;
}

export enum IDynamicValue {
  EcoGameplayDynamicValuesConstantValue = "Eco.Gameplay.DynamicValues.ConstantValue",
  EcoGameplayDynamicValuesMultiDynamicValue = "Eco.Gameplay.DynamicValues.MultiDynamicValue",
  The10HuntingSkillDecreases = "10 (HuntingSkill Decreases)",
  The12HuntingSkillIncreases = "1.2 (HuntingSkill Increases)",
  The15HuntingSkillIncreases = "1.5 (HuntingSkill Increases)",
  The1ElectronicsSkillDecreases = "1 (ElectronicsSkill Decreases)",
  The1HuntingSkillIncreases = "1 (HuntingSkill Increases)",
  The2BasicEngineeringSkillDecreases = "2 (BasicEngineeringSkill Decreases)",
  The2BlacksmithSkillDecreases = "2 (BlacksmithSkill Decreases)",
  The2HuntingSkillDecreases = "2 (HuntingSkill Decreases)",
  The2MechanicsSkillDecreases = "2 (MechanicsSkill Decreases)",
}

export interface CivicObjectType {
  Type: string;
}

export interface Clone {
  Item: string;
}

export interface Color {
  ByteColor: string;
}

export interface ControllerID {
  "Int32&": string;
}

export interface Deed {
  Deed: string;
}

export interface DescribeBlockAction {
  GameActionDescription: string;
}

export interface DrillDepth {
  Int32: string;
}

export interface HandOrigin {
  ItemHandOrigin: ItemHandOrigin;
}

export enum ItemHandOrigin {
  Left = "Left",
  Middle = "Middle",
  Right = "Right",
}

export interface HomeValue {
  HomeFurnishingValue: HomeFurnishingValue;
}

export enum HomeFurnishingValue {
  EcoGameplayHousingPropertyValuesHomeFurnishingValue = "Eco.Gameplay.Housing.PropertyValues.HomeFurnishingValue",
  Empty = "",
}

export interface Lure {
  LureEntity: string;
}

export interface ModuleTypesClass {
  ModuleTypes: ModuleTypesEnum;
}

export enum ModuleTypesEnum {
  ResourceEfficiencySpeedEfficiency = "ResourceEfficiency, SpeedEfficiency",
}

export interface MultiStrategy {
  MultiplicativeStrategy: MultiplicativeStrategy;
}

export enum MultiplicativeStrategy {
  EcoGameplayDynamicValuesMultiplicativeStrategy = "Eco.Gameplay.DynamicValues.MultiplicativeStrategy",
}

export interface Nutrients {
  FertilizerNutrients: FertilizerNutrients;
}

export enum FertilizerNutrients {
  EcoGameplayItemsFertilizerNutrients = "Eco.Gameplay.Items.FertilizerNutrients",
}

export interface Nutrition {
  Nutrients: string;
}

export interface OccupancyContextClass {
  OccupancyContext: OccupancyContextEnum;
}

export enum OccupancyContextEnum {
  EcoGameplayOccupancyPositionsRequirementContext = "Eco.Gameplay.Occupancy.PositionsRequirementContext",
  EcoGameplayOccupancySideAttachedContext = "Eco.Gameplay.Occupancy.SideAttachedContext",
  EcoGameplayOccupancyWaterDepthContext = "Eco.Gameplay.Occupancy.WaterDepthContext",
}

export interface PersistentData {
  Object?: string;
  ItemPersistentData?: string;
}

export interface Picture {
  UserTexture: string;
}

export interface Prerequisites {
  "RequiresSkillAttribute[]": RequiresSkillAttribute;
}

export enum RequiresSkillAttribute {
  EcoGameplaySkillsRequiresSkillAttribute = "Eco.Gameplay.Skills.RequiresSkillAttribute[]",
}

export interface RepairTag {
  Tag: string;
}

export interface RequiresSurfaceOnSides {
  DirectionAxisFlags: string;
}

export interface SkillTree {
  SkillTree: string;
}

export interface Settlement {
  Settlement: string;
}

export interface SettlementType {
  SettlementType: string;
}

export interface Skill {
  Skill: string;
}

export interface SkillReqs {
  "RepairRequiresSkillAttribute[]": RepairRequiresSkillAttribute;
}

export enum RepairRequiresSkillAttribute {
  EcoGameplaySkillsRepairRequiresSkillAttribute = "Eco.Gameplay.Skills.RepairRequiresSkillAttribute[]",
}

export interface Species {
  PlantSpecies: string;
}

export interface SpoilageTime {
  ImmutableCountdown: ImmutableCountdown;
}

export enum ImmutableCountdown {
  EcoSharedUtilsImmutableCountdown = "Eco.Shared.Utils.ImmutableCountdown",
}

export interface Subscriptions {
  "ThreadSafeSubscriptions&": string;
}

export interface Talents {
  "List`1"?: string;
  "Type[]"?: Type;
}

export interface Teacher {
  User: string;
}

export interface Tier {
  Int32?: string;
  IDynamicValue?: IDynamicValue;
}

export interface TimeLearned {
  Double: Double;
}

export enum Double {
  The17976931348623157E308 = "1.7976931348623157E+308",
}

export interface Yield {
  SkillModifiedValue: SkillModifiedValue;
}

export enum SkillModifiedValue {
  Empty = "",
  The1GatheringSkillIncreases = "1 (GatheringSkill Increases)",
}
