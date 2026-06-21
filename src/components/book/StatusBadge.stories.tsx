import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { StatusBadge } from './StatusBadge';

const meta = {
  component: StatusBadge,
  tags: ['ai-generated'],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MauDibaca: Story = {
  args: { status: 'mau-dibaca' },
};

export const SedangDibaca: Story = {
  args: { status: 'sedang-dibaca' },
};

export const Selesai: Story = {
  args: { status: 'selesai' },
};

export const Berhenti: Story = {
  args: { status: 'berhenti' },
};

export const IconOnly: Story = {
  args: { status: 'sedang-dibaca', tampilkanLabel: false },
};

export const CssCheck: Story = {
  args: { status: 'selesai' },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Selesai');
    const pill = badge.closest('.pill') as HTMLElement;
    await expect(getComputedStyle(pill).color).toBe('rgb(250, 158, 188)');
  },
};
