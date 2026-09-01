'use client';

import Button from '@/components/ui/Button';

type Props = {
  draftModeEnabled: boolean;
  enableLabel: string;
  disableLabel: string;
};

export default function DraftModeToggler({ draftModeEnabled, enableLabel, disableLabel }: Props) {
  async function handleClick() {
    let response: Response;

    if (draftModeEnabled) {
      response = await fetch('/api/draft-mode/disable');
    } else {
      const token = prompt('To enter Draft Mode, you need to insert the SECRET_API_TOKEN:');
      if (!token) {
        return;
      }

      response = await fetch(`/api/draft-mode/enable?token=${token}`);
    }

    if (!response.ok) {
      alert('Could not complete the operation!');
      return;
    }

    document.location.reload();
  }

  if (draftModeEnabled) {
    return (
      <Button variant="outline" size="small" onClick={handleClick}>
        {disableLabel}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="small" onClick={handleClick}>
      {enableLabel}
    </Button>
  );
}
