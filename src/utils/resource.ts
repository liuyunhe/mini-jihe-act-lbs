import { getData } from "@/store/store";
import { IGetImageInfoResult, IResources } from "@/types/resources";

export function getResource(key: keyof IResources): IGetImageInfoResult {
  const images = getData('images') as IResources || {}
  const resource = images[key] || {}
  return resource
}