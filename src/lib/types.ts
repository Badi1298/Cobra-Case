import { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from '@prisma/client';

export type TConfig = {
	color: CaseColor;
	finish: CaseFinish;
	material: CaseMaterial;
	model: PhoneModel;
	configId: string;
};
