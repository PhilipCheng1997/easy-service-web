import importComponentsGroup from '../import';

const modules = import.meta.glob('./*.ts', { eager: true });
const group = importComponentsGroup(modules, 'basic', '基础组件');

export default group;
