import React from 'react';
import { Box, Checkbox } from '@chakra-ui/react';

interface MajorCheckboxProps {
  major: string;
  isChecked: boolean;
  onChange: (major: string, isChecked: boolean) => void;
}

const MajorCheckbox: React.FC<MajorCheckboxProps> = React.memo(({ major, isChecked, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(major, event.target.checked);
  };

  return (
    <Box>
      <Checkbox size="sm" isChecked={isChecked} onChange={handleChange}>
        {major.replace(/<p>/gi, ' ')}
      </Checkbox>
    </Box>
  );
});

export default MajorCheckbox;