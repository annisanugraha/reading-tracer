import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { ProgressBar } from './ProgressBar';

const meta = {
  component: ProgressBar,
  tags: ['ai-generated'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: 0, label: 'Progress' },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '0');
  },
};

export const Started: Story = {
  args: { value: 25, label: 'Halaman' },
};

export const Halfway: Story = {
  args: { value: 50, label: 'Progress' },
};

export const NearComplete: Story = {
  args: { value: 87, label: 'Progress' },
};

export const Complete: Story = {
  args: { value: 100, label: 'Progress' },
};

export const NoLabel: Story = {
  args: { value: 60 },
};
