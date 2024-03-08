import { Platform } from './platform.interface';
import { ProjectRelease } from './project-release.interface';

export interface Project {
  projectId: string;
  name: string;
  platform: Platform;
  tags: string[];
  environments: string[];
  releases: ProjectRelease[];
}
