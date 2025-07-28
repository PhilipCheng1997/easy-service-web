import importComponentsGroup from '../import';

const modules = import.meta.glob('./*.ts', { eager: true });
const group = importComponentsGroup(modules, 'other', '其他组件', 3);

export default group;
