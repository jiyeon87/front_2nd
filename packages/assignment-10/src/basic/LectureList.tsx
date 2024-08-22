import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Lecture } from './types';

interface LectureListProps {
  lectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
}

const CHUNK_SIZE = 50;
const SCROLL_THRESHOLD = 200;

const LectureItem = React.memo(({ lecture, onAddSchedule }: { lecture: Lecture, onAddSchedule: (lecture: Lecture) => void }) => (
  <Tr>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }}/>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
    <Td width="80px">
      <Button size="sm" colorScheme="green" onClick={() => onAddSchedule(lecture)}>추가</Button>
    </Td>
  </Tr>
));

const LectureList: React.FC<LectureListProps> = ({ lectures, onAddSchedule }) => {
  const [visibleChunks, setVisibleChunks] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
      setVisibleChunks(prev => Math.min(prev + 1, Math.ceil(lectures.length / CHUNK_SIZE)));
    }
  }, [lectures.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const visibleLectures = lectures.slice(0, visibleChunks * CHUNK_SIZE);

  return (
    <Box ref={containerRef} overflowY="auto" maxH="500px">
      <Table size="sm" variant="striped">
        <Thead position="sticky" top={0} bg="white" zIndex={1}>
          <Tr>
            <Th width="100px">과목코드</Th>
            <Th width="50px">학년</Th>
            <Th width="200px">과목명</Th>
            <Th width="50px">학점</Th>
            <Th width="150px">전공</Th>
            <Th width="150px">시간</Th>
            <Th width="80px"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {visibleLectures.map((lecture, index) => (
            <LectureItem key={`${lecture.id}-${index}`} lecture={lecture} onAddSchedule={onAddSchedule} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default React.memo(LectureList);