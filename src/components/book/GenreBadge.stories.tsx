import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GenreBadge } from './GenreBadge';

const meta = {
  component: GenreBadge,
  tags: ['ai-generated'],
} satisfies Meta<typeof GenreBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fiction: Story = {
  args: { nama: 'fiksi' },
};

export const Technology: Story = {
  args: { nama: 'teknologi' },
};

export const Memoir: Story = {
  args: { nama: 'memoar' },
};

export const Philosophy: Story = {
  args: { nama: 'filsafat' },
};

export const Poetry: Story = {
  args: { nama: 'puisi' },
};
