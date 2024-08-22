import React, { useCallback } from 'react';
import { Stack } from '@chakra-ui/react';
import MajorCheckbox from './MajorCheckbox';

interface MajorListProps {
  allMajors: string[];
  selectedMajors: string[];
  onMajorChange: (majors: string[]) => void;
}

const MajorList: React.FC<MajorListProps> = React.memo(({ allMajors, selectedMajors, onMajorChange }) => {
  const handleMajorChange = useCallback((major: string, isChecked: boolean) => {
    if (isChecked) {
      onMajorChange([...selectedMajors, major]);
    } else {
      onMajorChange(selectedMajors.filter(m => m !== major));
    }
  }, [selectedMajors, onMajorChange]);

  return (
    <Stack spacing={2} overflowY="auto" h="100px" border="1px solid" borderColor="gray.200" borderRadius={5} p={2}>
      {allMajors.map(major => (
        <MajorCheckbox
          key={major}
          major={major}
          isChecked={selectedMajors.includes(major)}
          onChange={handleMajorChange}
        />
      ))}
    </Stack>
  );
});

export default MajorList;