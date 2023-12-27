export enum SkillType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

export interface SkillI {
  id?: number;
  name?: string;
  level?: number;
  type?: SkillType;

}
