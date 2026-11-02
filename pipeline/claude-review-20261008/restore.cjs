'use strict';
// 26.10.08 Claude 리뷰 반영분(결함 수정·고양이 대사, 이후 사촌 쌍, 긴 예문 다시 쓰기)을 기록대로만 되돌린다.
// Codex의 복원 체인(restore-player-feedback-20261007 → history-review …) 맨 위에서 먼저 실행된다.
// 현재 상태가 각 원장의 '적용 후' 해시와 같을 때만 되돌리고, 되돌린 결과가 '적용 전' 해시와 정확히 같아야 한다.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {hash,reverse}=require('./ledger-lib.cjs');
const LAYERS=['ishmael-20261024','cat-curse-20261017','astra-content-20261015','ten-20261014','pet-it-20261014','lunch-20261013','not-cat-20261013','soseki-i-20261013','c-example-20261013','sex-gender-20261013','oxford5000-20261013','pull-20261013','fable-review-20261013','astra-review-20261013','set43-20261012','set42-20261012','set41-20261012','set40-20261012','set45b-20261012','set45-20261012','set44-20261012','set39-20261012','set38-20261012','set37-20261012','set36-20261012','set35-20261012','set34-20261012','set33-20261012','set32-20261012','set31-20261012','set30-20261012','set29-20261012','set28-20261012','set27-20261012','set26-20261012','set23-20261012','set22-20261012','set25-20261012','set24-20261012','set21-20261012','set20-20261012','set19-20261012','set18-20261012','set15-20261012','set14-20261012','set9-20261012','set8-20261012','set11-20261012','set10-20261012','set7-20261012','set6-20261012','set13-20261012','set12-20261012','set17-20261012','set16-20261012','set4-20261012','set3-20261012','set2-20261012','set1-20261012','set5-20261012','novel-quotes-20261012','set0-rebalance-20261012','set0-review2-20261011','set0-review-20261011','codex-review-20261011','set0-20261010','narrow-notes-20261010','oxford-20261010','variant-notes-20261010','cockroach-20261010','prune-20261010','knowledge-16','knowledge-15','knowledge-14','knowledge-13','knowledge-12','knowledge-11','knowledge-05','knowledge-07','knowledge-06','knowledge-08','knowledge-10','knowledge-09','word-notes','knowledge-04','proper-nouns','knowledge-03','knowledge-02','knowledge-01','country','academic-terms','long-examples','cousin-pairs','content-fixes']   // 최신 순
  .map(n=>path.join(__dirname,n+'.json')).filter(f=>fs.existsSync(f))
  .map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
function restoreClaudeReview20261008(data){
  let v=data;
  for(const L of LAYERS){
    const s=L.snapshots.DATA;if(hash(v)!==s.afterHash)continue;
    v=reverse(v,s.changes,s.keyOrders);
    assert.equal(hash(v),s.beforeHash,'Unexpected DATA changes outside Claude review layer '+L.name);
  }
  return v;
}
function restoreClaudeReviewSource20261008(value,file){
  let v=value;
  for(const L of LAYERS){
    const s=L.sourceSnapshots[file];if(!s||hash(v)!==s.afterHash)continue;
    v=reverse(v,L.sourceChanges[file],L.sourceKeyOrders[file]);
    assert.equal(hash(v),s.beforeHash,'Unexpected source changes outside Claude review layer '+L.name+' in '+file);
  }
  return v;
}
module.exports={restoreClaudeReview20261008,restoreClaudeReviewSource20261008,LAYERS};
