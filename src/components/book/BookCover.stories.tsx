import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BookCover } from './BookCover';

const meta = {
  component: BookCover,
  tags: ['ai-generated'],
} satisfies Meta<typeof BookCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: { judul: 'Laskar Pelangi', size: 'sm' },
};

export const Medium: Story = {
  args: { judul: 'Atomic Habits', size: 'md' },
};

export const Large: Story = {
  args: { judul: 'Sapiens', size: 'lg' },
};

export const ExtraLarge: Story = {
  args: { judul: 'The Pragmatic Programmer', size: 'xl' },
};

export const WithCover: Story = {
  args: {
    judul: 'Cantik Itu Luka',
    src: 'https://placehold.co/300x450/4E8BC4/ffffff?text=CIL',
    size: 'lg',
  },
};
