import importComponentsGroup from '../import';

const modules = import.meta.glob('./*.ts', { eager: true });
const group = importComponentsGroup(modules, 'layout', '布局组件');

export default group;
