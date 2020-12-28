package pl.olawa.irvik.irvikProject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.olawa.irvik.irvikProject.dao.CategoriesJpaRepo;
import pl.olawa.irvik.irvikProject.dao.CategoriesRepository;
import pl.olawa.irvik.irvikProject.domain.Categories;
import pl.olawa.irvik.irvikProject.dto.CategoriesDto;
import pl.olawa.irvik.irvikProject.exception.ProductnotFoundException;
import pl.olawa.irvik.irvikProject.service.imp.CategoriesServiceImpl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoriesService implements CategoriesServiceImpl {

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private CategoriesJpaRepo categoriesJpaRepo;



    @Override
    public Categories save(Categories categories) {
        return categoriesRepository.save(categories);
    }

    @Override
    public ResponseEntity<Categories> update(UUID id, CategoriesDto categoriesDto) {
        Categories categories1 = categoriesJpaRepo.findById(id).orElseThrow(()-> new ProductnotFoundException("Categories not exist with id L" +id));
        categories1.setCategoryUk(categoriesDto.getNameUA());
        categories1.setCategoryEn(categoriesDto.getNameEU());
        categories1.setCategoryPl(categoriesDto.getNamePL());
        Categories categoriesEmp = categoriesRepository.save(categories1);
        return ResponseEntity.ok(categoriesEmp);
    }

    @Override
    public Optional<Categories> findById(UUID categoriesId) {
        return categoriesRepository.findById(categoriesId);
    }

    @Override
    public List<Categories> getAllCategories() {
        return categoriesJpaRepo.findAll();
    }

    @Override
    public void delete(UUID id) {
        categoriesRepository.deleteById(id);
    }
}
